import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { FirebaseAdminService } from '../firebase-admin.service';
import { PrismaService } from '../../../shared/prisma/prisma.service';

@Injectable()
export class FirebaseAuthGuard implements CanActivate {
  private readonly logger = new Logger(FirebaseAuthGuard.name);

  constructor(
    private readonly firebaseAdmin: FirebaseAdminService,
    private readonly prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    this.logger.log(`🔐 [FirebaseAuthGuard] Verificando autenticação...`);
    this.logger.log(`📋 Headers: ${JSON.stringify(request.headers)}`);

    if (!authHeader) {
      this.logger.warn('❌ Token de autenticação não fornecido');
      throw new UnauthorizedException('Token de autenticação não fornecido');
    }

    const [type, token] = authHeader.split(' ');
    this.logger.log(`🔑 Token tipo: ${type}, Token preview: ${token?.substring(0, 20)}...`);

    if (type !== 'Bearer' || !token) {
      this.logger.warn('❌ Formato de token inválido');
      throw new UnauthorizedException('Formato de token inválido');
    }

    try {
      this.logger.log(`🔍 Verificando token Firebase...`);
      // Verifica o token Firebase
      const decodedToken = await this.firebaseAdmin.verifyIdToken(token);
      this.logger.log(`✅ Token Firebase válido: ${JSON.stringify(decodedToken)}`);

      if (!decodedToken) {
        throw new UnauthorizedException('Token Firebase inválido');
      }

      // Busca ou cria o usuário no banco de dados local
      let user = await this.prisma.user.findFirst({
        where: {
          OR: [
            { email: decodedToken.email },
            // Se quiser vincular pelo Firebase UID no futuro:
            // { firebaseUid: decodedToken.uid }
          ],
        },
      });

      // Se o usuário não existe no banco local, cria automaticamente
      if (!user && decodedToken.email) {
        this.logger.log(`Creating new user from Firebase: ${decodedToken.email}`);
        user = await this.prisma.user.create({
          data: {
            email: decodedToken.email,
            name: decodedToken.name || decodedToken.email.split('@')[0],
            password: '', // Sem senha local, usa Firebase
            role: 'STUDENT', // Default role
            isActive: true,
          },
        });
      }

      if (!user) {
        throw new UnauthorizedException('Usuário não encontrado');
      }

      if (!user.isActive) {
        throw new UnauthorizedException('Usuário desativado');
      }

      // Adiciona informações ao request
      request.user = {
        userId: user.id, // Mudado de 'id' para 'userId' para consistência
        id: user.id, // Mantém 'id' para compatibilidade
        email: user.email,
        name: user.name,
        role: user.role,
        firebaseUid: decodedToken.uid,
        emailVerified: decodedToken.email_verified,
      };

      return true;
    } catch (error) {
      this.logger.error('Firebase auth error', error);
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new UnauthorizedException('Token inválido ou expirado');
    }
  }
}
