import { SvgColor } from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name: string) => (
  <SvgColor width="100%" height="100%" src={`/assets/icons/navbar/${name}.svg`} />
);

export const navData = [
  {
    title: 'Dashboard',
    path: '/',
    icon: icon('ic-analytics'),
  },
  {
    title: 'Student',
    path: '/student',
    icon: icon('ic-user'),
  },
  {
    title: 'Logout',
    path: '/login',
    func: "signOutUser",
    icon: icon('ic-disabled'),
  },
];