import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  Default,
  ForeignKey,
  BelongsTo,
} from "sequelize-typescript";
import User from "../user.model"
import Store from "../store.model";

@Table({ tableName: "wishlists", timestamps: false })
class Wishlist extends Model<Wishlist> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id!: string;

  @ForeignKey(() => User)
  @Column(DataType.UUID)
  userId!: string;

  @ForeignKey(() => Store)
  @Column(DataType.UUID)
  productId!: string;

  @BelongsTo(() => User)
  user!: User;

  @BelongsTo(() => Store)
  store!: Store;
}

export default Wishlist