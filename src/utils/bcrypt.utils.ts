import * as bcrypt from 'bcrypt';

export async function hashPassword(password: string) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function comparePassword(
  plainPassword: string,
  hashPassword: string,
) {
  return bcrypt.compare(plainPassword, hashPassword);
}
