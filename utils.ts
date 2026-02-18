export const getCurrentTenant = (): string => {
  const hostname = window.location.hostname;
  const parts = hostname.split('.');
  // For localhost or simple domain, use 'default'
  if (parts.length < 2 || hostname === 'localhost') {
    return 'default';
  }
  return parts[0];
};
