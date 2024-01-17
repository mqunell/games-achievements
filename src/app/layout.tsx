import { Anek_Gujarati, Poppins } from 'next/font/google';
import clsx from 'clsx';
import Footer from '@/components/Footer';
import '@/styles/globals.css';

const anek_gujarati = Anek_Gujarati({
	subsets: ['latin'],
	weight: '400',
	variable: '--font-anek-gujarati',
});

const poppins = Poppins({
	subsets: ['latin'],
	weight: '500',
	variable: '--font-poppins',
});

export const metadata = {
	title: 'Games and Achievements',
	description: 'Steam, Xbox, and Switch games and achievements',
};

const RootLayout = ({ children }: { children: React.ReactNode }) => {
	return (
		<html lang="en" className={clsx(anek_gujarati.variable, poppins.variable)}>
			<body>
				{children}
				<Footer />
			</body>
		</html>
	);
};

export default RootLayout;
