import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';
/**
 * Marca uma rota ou controller como público (sem necessidade de autenticação)
 * 
 * @example
 * ```typescript
 * @Public()
 * @Get('/status')
 * getStatus() {
 *   return { status: 'ok' };
 * }
 * ```
 */
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
