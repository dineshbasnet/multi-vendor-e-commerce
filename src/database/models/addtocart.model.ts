import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  Default,
  ForeignKey,
  BelongsTo,
  AllowNull,
} from "sequelize-typescript";
import User from "./user.model";
import Store from "./store.model";

@Table({
  tableName: "carts",
  timestamps: true,
})
class Cart extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  declare id: string;

  @AllowNull(false)
  @ForeignKey(() => User)
  @Column(DataType.UUID)
  declare userId: string;

  @AllowNull(false)
  @Column(DataType.UUID)
  declare productId: string;

  @AllowNull(false)
  @ForeignKey(() => Store)
  @Column(DataType.UUID)
  declare storeId: string;

  @AllowNull(false)
  @Column(DataType.INTEGER)
  declare quantity: number;

  @BelongsTo(() => User)
  declare user: User;

  @BelongsTo(() => Store)
  declare store: Store;
}

export default Cart;
