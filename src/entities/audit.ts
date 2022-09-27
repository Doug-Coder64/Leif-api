import { Entity, Column, PrimaryColumn, Generated, Index, In } from 'typeorm';

@Entity({ name: 'audit' })
export default class Audit {
  @PrimaryColumn({ name: 'id', type: 'integer' })
  @Generated('increment')
  id: number;

  @Index()
  @Column({ name: 'userid', type: 'text', nullable: false, default: 'SYSTEM' })
  userid: string;

  @Index()
  @Column({
    name: 'date',
    type: 'timestamp',
    nullable: false,
    default: () => 'CURRENT_TIMESTAMP',
    comment: 'when created',
  })
  date: Date;

  @Column({ name: 'event', type: 'text', nullable: true })
  event: string;

  @Column({ name: 'path', type: 'text', nullable: true })
  path: string;

  @Column({ name: 'body', type: 'text', nullable: true })
  body: string;
}
