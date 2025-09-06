export const requireRoles = (...allowed) => {
  return (req, res, next) => {
    try {
      const role = req.body?.role;
      if (!role) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
      }
      if (allowed.length && !allowed.includes(role)) {
        return res.status(403).json({ success: false, message: 'Forbidden: insufficient role' });
      }
      next();
    } catch (e) {
      return res.status(500).json({ success: false, message: 'Role check failed' });
    }
  };
};
