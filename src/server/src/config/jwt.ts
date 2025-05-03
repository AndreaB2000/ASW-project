/**
 * JWT secret value.
 */
export const secret: string = process.env.JWT_SECRET || 'supersecret';

/**
 * JWT expiration time.
 */
export const expiration: number = +process.env.JWT_EXPIRATION || 3600; // I really don't know why but prefixing a string with a + turns it into a number
