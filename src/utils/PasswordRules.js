export const passwordRules = [
  { label: "8 to 64 characters", test: (p) => p.length >= 8 && p.length <= 64 },
  { label: "One uppercase letter", test: (p) => /[A-Z]/.test(p) },
  { label: "One lowercase letter", test: (p) => /[a-z]/.test(p) },
  { label: "One number", test: (p) => /[0-9]/.test(p) },
  { label: "One special character", test: (p) => /[^A-Za-z0-9\s]/.test(p) },
  { label: "No spaces", test: (p) => !/\s/.test(p) },
];

export const validatePassword = (password = "") => {
  const failed = passwordRules.find((rule) => !rule.test(password));
  return failed ? `Password needs: ${failed.label.toLowerCase()}` : true;
};