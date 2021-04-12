import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn, Unique } from "typeorm";
import * as bcryptjs from "bcryptjs";
import { Task } from "src/tasks/task.entity";

@Entity()
@Unique(['username'])
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  password: string;

  @Column()
  salt: string;

  @OneToMany(type => Task, task => task.user, { eager: true })
  tasks: Task[]

  async isPasswordValid(password: string): Promise<boolean> {
    const hash = await bcryptjs.hash(password, this.salt);
    return hash === this.password;
  }
}