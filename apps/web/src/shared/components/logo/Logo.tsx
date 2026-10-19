interface HeaderLogoProps {
	title?: string;
	imgSrc?: string;
	children?: React.ReactNode;
}

const Logo = ({ title = 'ServeMate', imgSrc = '/globe.svg', children }: HeaderLogoProps) => {
	return (
		<div className='flex items-center pb-4 align-middle'>
			{/* <Image src={`${imgSrc}`} alt={`${title} Logo`} width={30} height={30} /> */}
			<span className='text-ctp-mauve ml-2 text-xl font-bold'>{title}</span>
			{children}
		</div>
	);
};

export default Logo;
