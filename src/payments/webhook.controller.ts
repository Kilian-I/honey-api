import * as common from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import Stripe from 'stripe';
import * as express from 'express';

import { Product } from 'src/products/entities/product.entity';

@common.Controller('webhook')
export class WebhookController {
  private stripe: Stripe;

  constructor(
    private configService: ConfigService,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {
    const apiKey = this.configService.getOrThrow<string>('STRIPE_SECRET_KEY');
    this.stripe = new Stripe(apiKey, {
      apiVersion: '2025-01-27' as any,
    });
  }

  @common.Post()
  async handleStripeWebhook(

    @common.Req() req: common.RawBodyRequest<express.Request>,
    @common.Headers('stripe-signature') sig: string,
  ) {
    const endpointSecret = this.configService.getOrThrow<string>('STRIPE_WEBHOOK_SECRET');

    if (!sig) throw new common.BadRequestException('Signature Stripe manquante');
    if (!req.rawBody) throw new common.BadRequestException('Raw body manquant');

    let event: Stripe.Event;

    try {
      event = this.stripe.webhooks.constructEvent(req.rawBody, sig, endpointSecret);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      throw new common.BadRequestException(`Webhook Error: ${msg}`);
    }

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      const lineItems = await this.stripe.checkout.sessions.listLineItems(session.id);

      // 2. Appeler ton service de stock (TODO)
      await this.stockService.handlePostPayment(session.metadata, lineItems.data);

      console.log(`Commande validée et stock mis à jour pour l'utilisateur : ${session.metadata?.userId}`);
    }

    return { received: true };
  }
}