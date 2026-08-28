export default function Footer() {
  const columns = [
    { title: 'Support', links: ['Help Center', 'Safety', 'Cancellation options', 'Contact us'] },
    { title: 'Hosting', links: ['Become a host', 'Host resources', 'Community forum'] },
    { title: 'Airbnb', links: ['Newsroom', 'New features', 'Careers'] },
    { title: 'Legal', links: ['Terms', 'Privacy', 'Sitemap'] },
  ];

  return (
    <footer className="site-footer">
      <div className="footer-columns">
        {columns.map((col) => (
          <div key={col.title} className="footer-column">
            <h4>{col.title}</h4>
            <ul>
              {col.links.map((link) => (
                <li key={link}>{link}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="footer-copyright">
        <span>© {new Date().getFullYear()} Airbnb Clone</span>
        <span className="footer-lang">English (US)</span>
        <span className="footer-currency">$ USD</span>
      </div>
    </footer>
  );
}
