import { BadRequestException, Injectable } from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from 'src/products/entities/product.entity';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';


@Injectable()
export class PaymentsService {
  private stripe: Stripe;

  constructor(
    private configService: ConfigService,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {
    this.stripe = new Stripe(this.configService.getOrThrow<string>('STRIPE_SECRET_KEY'), {
      apiVersion: '2026-03-25.dahlia' as any, // Utilise la version stable la plus récente
    });
  }

  //Checkout session par utilisateur
  async createCheckoutSession(productId: string, quantity: number, user: any) {
    // 1. Récupérer le produit en DB pour garantir l'intégrité du prix
    const product = await this.productRepository.findOne({ where: { id: productId } });
    if (!product) throw new BadRequestException('Produit introuvable');

    // 2. Déterminer le prix et l'unité selon le rôle (B2B ou B2C)
    const isB2B = user.role === 'BUSINESS';
    const unitAmount = isB2B ? product.priceB2B : product.priceB2C;
    const description = isB2B ? `${product.name} (Format Palette)` : `${product.name} (Pot individuel)`;

    // 3. Créer la session Stripe
    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: product.name,
              description: description,
              metadata: { productId: product.id, unitType: isB2B ? 'pallet' : 'unit' },
            },
            unit_amount: unitAmount, // Prix en centimes
          },
          quantity: quantity,
        },
      ],
      mode: 'payment',
      customer_email: user.email,
      success_url: `${this.configService.get('FRONTEND_URL')}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${this.configService.get('FRONTEND_URL')}/cart`,
      // On passe l'ID utilisateur en metadata pour le retrouver lors du Webhook
      metadata: { userId: user.id },
    });
  }

  findAll() {
    return `This action returns all payments`;
  }

  findOne(id: number) {
    return `This action returns a #${id} payment`;
  }

  update(id: number, updatePaymentDto: UpdatePaymentDto) {
    return `This action updates a #${id} payment`;
  }

  remove(id: number) {
    return `This action removes a #${id} payment`;
  }
}
