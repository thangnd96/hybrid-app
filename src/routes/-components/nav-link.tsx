import { createLink, type LinkComponent } from '@tanstack/react-router';
import { type HTMLAttributes, forwardRef } from 'react';

const BasicLink = forwardRef<HTMLAnchorElement, HTMLAttributes<HTMLAnchorElement>>((props, ref) => {
  return <a {...props} ref={ref}></a>;
});

BasicLink.displayName = 'BasicLink';

const CreatedLinkComponent = createLink(BasicLink);

const NavLink: LinkComponent<typeof BasicLink> = props => {
  return <CreatedLinkComponent activeProps={{ className: 'text-red-600' }} {...props} />;
};

export default NavLink;
