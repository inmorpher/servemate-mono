import { Prisma, PrismaClient, UserRole } from '@prisma/client';
import { compare } from 'bcrypt';
import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { TYPES } from '../types';
import { UserFilters, UserListItem, UserMetaDto, UserSortColumn } from '@servemate/shared-dto';

// bcrypt hash of a throwaway string; compared when the email is unknown so timing matches a real check.
const DUMMY_PASSWORD_HASH =
  '$2b$10$DTYAgzZP1wNaqjcVZl3ByugQigXrNJ8hKZo5JPg/qvhrP8.8EIZUW';

export type UserPagination = {
  page: number;
  pageSize: number;
};

export type UserSort = {
  sortBy: UserSortColumn;
  sortOrder: 'asc' | 'desc';
};

@injectable()
export class UsersRepository {
  constructor(@inject(TYPES.PrismaClient) private prisma: PrismaClient) {}
  async getMeta(): Promise<UserMetaDto> {
    const fallbackDate = new Date().toISOString();
    const dateRange = await this.prisma.user.aggregate({
      _min: { createdAt: true },
      _max: { createdAt: true },
    });

    return {
      roles: Object.values(UserRole),
      activeStates: [true, false],
      createdAtRange: {
        min: dateRange._min.createdAt?.toISOString() ?? fallbackDate,
        max: dateRange._max.createdAt?.toISOString() ?? fallbackDate,
      },
    };
  }

  async findMany(
    filters: UserFilters,
    pagination: UserPagination,
    sort: UserSort
  ): Promise<{ users: UserListItem[]; total: number }> {
    const where = this.buildWhere(filters);

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          isActive: true,
          createdAt: true,
          updatedAt: true,
          lastLogin: true,
        },
        skip: (pagination.page - 1) * pagination.pageSize,
        take: pagination.pageSize,
        orderBy: {
          [sort.sortBy]: sort.sortOrder,
        },
      }),
      this.prisma.user.count({ where }),
    ]);
    return {
      users: users.map(user => ({ ...user, role: user.role as UserRole })),
      total,
    };
  }

  async findById(id: number): Promise<UserListItem | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
        lastLogin: true,
      },
    });
    return user ? { ...user, role: user.role as UserRole } : null;
  }

  async findByEmail(email: string): Promise<UserListItem | null> {
    const user = await this.prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
        lastLogin: true,
      },
    });
    return user ? { ...user, role: user.role as UserRole } : null;
  }

  async existsByEmail(email: string): Promise<boolean> {
    const count = await this.prisma.user.count({
      where: { email },
    });
    return count > 0;
  }

  async create(data: {
    name: string;
    email: string;
    role: UserRole;
    password: string;
  }) {
    return this.prisma.user.create({
      data,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });
  }

  async update(
    id: number,
    data: {
      name?: string;
      email?: string;
      role?: UserRole;
      isActive?: boolean;
      lastLogin?: Date | null;
    }
  ) {
    return this.prisma.user.update({
      where: { id },
      data,
    });
  }

  async delete(id: number) {
    const [, user] = await this.prisma.$transaction([
      this.prisma.session.deleteMany({ where: { userId: id } }),
      this.prisma.user.delete({ where: { id } }),
    ]);
    return user;
  }

  async countActiveOrdersByServer(serverId: number): Promise<number> {
    return this.prisma.order.count({
      where: { serverId },
    });
  }

  async verifyCredentials(
    email: string,
    password: string
  ): Promise<UserListItem | null> {
    const user = await this.prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        password: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
        lastLogin: true,
      },
    });

    // Always run bcrypt so response timing does not reveal whether the email exists.
    const isMatch = await compare(password, user?.password ?? DUMMY_PASSWORD_HASH);

    if (!user || !user.isActive || !isMatch) {
      return null;
    }

    const { password: _, ...safeUser } = user;
    return { ...safeUser, role: user.role as UserRole };
  }

  private buildWhere(filters: UserFilters): Prisma.UserWhereInput {
    return {
      ...(filters.id !== undefined && { id: filters.id }),
      ...(filters.email && {
        email: { contains: filters.email, mode: 'insensitive' as const },
      }),
      ...(filters.name && {
        name: { contains: filters.name, mode: 'insensitive' as const },
      }),
      ...(filters.role && { role: filters.role }),
      ...(filters.isActive !== undefined && { isActive: filters.isActive }),
      ...(filters.createdAfter && { createdAt: { gte: filters.createdAfter } }),
      ...(filters.createdBefore && {
        createdAt: { lte: filters.createdBefore },
      }),
    };
  }
}
