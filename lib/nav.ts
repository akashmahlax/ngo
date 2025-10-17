export function getDashboardBase(role?: string) {
  if (role === "ngo") return "/ngo"
  return "/volunteer"
}

export function getDashboardProfilePath(role?: string) {
  return `${getDashboardBase(role)}/profile`
}
