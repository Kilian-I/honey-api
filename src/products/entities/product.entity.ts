import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

export enum ProductUnit {
    UNIT = 'unit',    // Pour le B2C (le pot)
    PALLET = 'pallet'  // Pour le B2B
}

@Entity('products')
export class Product {
    @PrimaryGeneratedColumn('uuid')
    id!: string; // Ajoute ! ici

    @Column()
    name!: string;

    @Column('text')
    description!: string;

    @Column({ unique: true })
    slug!: string;

    // --- PRICING STRIPE ---
    @Column()
    stripeProductId!: string;

    @Column()
    priceB2C!: number;

    @Column()
    priceB2B!: number;

    // --- LOGISTIQUE ---
    @Column({ default: 0 })
    stockQuantity!: number; 

    @Column({ default: 120 })
    itemsPerPallet!: number;

    @Column({
        type: 'decimal',
        precision: 10,
        scale: 3,
        transformer: {
            to: (value: number) => value,
            from: (value: string) => parseFloat(value),
        },
    })
    weightPerUnit!: number;

    @CreateDateColumn()
    createdAt!: Date;
}