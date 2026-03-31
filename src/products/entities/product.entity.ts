//entites/products.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

export enum ProductUnit {
  UNIT = 'unit',     // Pour le B2C (le pot)
  PALLET = 'pallet'  // Pour le B2B
}

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column('text')
  description: string;

  @Column()
  slug: string; // Pour des URLs SEO-friendly

  // --- PRICING STRIPE ---
  @Column()
  stripeProductId: string; // ID produit dans Stripe

  @Column()
  priceB2C: number; // Prix en centimes (ex: 850 pour 8.50€)

  @Column()
  priceB2B: number; // Prix palette HT en centimes

  // --- LOGISTIQUE ---
  @Column({ default: 0 })
  stockQuantity: number; // Quantité totale en pots individuels

  @Column({ default: 120 })
  itemsPerPallet: number; // Combien de pots dans une palette

  @Column('decimal')
  weightPerUnit: number; // Poids en kg pour calcul frais de port

  @CreateDateColumn()
  createdAt: Date;
}