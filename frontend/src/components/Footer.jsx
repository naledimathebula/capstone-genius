/**
 * Footer.jsx — static site footer with 4 link columns and a copyright bar.
 * Links are proper <a> elements (open in a new tab where applicable).
 */
export default function Footer() {
  const columns = [
    {
      title: 'Support',
      links: [
        { label: 'Help Center',          href: '#' },
        { label: 'Safety information',   href: '#' },
        { label: 'Cancellation options', href: '#' },
        { label: 'Contact us',           href: '#' },
      ],
    },
    {
      title: 'Hosting',
      links: [
        { label: 'Become a host',    href: '#' },
        { label: 'Host resources',   href: '#' },
        { label: 'Community forum',  href: '#' },
        { label: 'Hosting responsibly', href: '#' },
      ],
    },
    {
      title: 'Airbnb',
      links: [
        { label: 'Newsroom',     href: '#' },
        { label: 'New features', href: '#' },
        { label: 'Careers',      href: '#' },
        { label: 'Investors',    href: '#' },
      ],
    },
    {
      title: 'Legal',
      links: [
        { label: 'Terms of service',     href: '#' },
        { label: 'Privacy policy',       href: '#' },
        { label: 'Cookie policy',        href: '#' },
        { label: 'Sitemap',              href: '#' },
      ],
    },
  ];

  return (
    <footer className="site-footer">
      {/* Link columns */}
      <div className="footer-columns">
        {columns.map((col) => (
          <div key={col.title} className="footer-column">
            <h4>{col.title}</h4>
            <ul>
              {col.links.map((link) => (
                <li key={link.label}>
                  <a href={link.href}>{link.label}</a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Copyright bar */}
      <div className="footer-copyright">
        <span>© {new Date().getFullYear()} Genius Airbnb Clone. All rights reserved.</span>
        <span className="footer-lang">English (US)</span>
        <span className="footer-currency">$ USD</span>
      </div>
    </footer>
  );
}
