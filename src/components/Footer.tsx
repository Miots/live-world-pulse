const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-12 text-center">
      <p className="text-sm text-muted-foreground">
        Live World Pulse — a real-time data visualization project
      </p>
      <p className="text-xs text-muted-foreground mt-2">
        © {currentYear} All rights reserved
      </p>
      <p className="text-xs text-muted-foreground mt-1">
        Build & Designed by{" "}
        <a
          href="https://miots.vercel.app"
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:underline transition-all"
        >
          Miots
        </a>
      </p>
    </footer>
  );
};

export default Footer;