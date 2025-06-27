
import { Table, Column, Model, DataType, HasOne } from "sequelize-typescript";
import Store from "./store.model";

@Table({
    tableName: 'users',
    modelName: 'User',
    timestamps: true
})

class User extends Model {
    @Column({
        primaryKey: true,
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4
    })
    declare id: string

    @Column({
        type: DataType.STRING
    })
    declare username: string

    @Column({
        type: DataType.STRING
    })
    declare password: string

    @Column({
        type: DataType.STRING,
        unique: true
    })
    declare email: string
    @Column({
        type: DataType.ENUM('store', 'super-admin', 'customer'),
        defaultValue: 'customer',
    })
    declare role: string

    @HasOne(() => Store)
    declare store: Store;

}

export default User