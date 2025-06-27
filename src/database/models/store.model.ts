
import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from "sequelize-typescript";
import User from "./user.model";

@Table({
    tableName: 'stores',
    modelName: 'Store',
    timestamps: true
})

class Store extends Model {
    @Column({
        primaryKey: true,
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4
    })
    declare id: string

    @Column({
        type: DataType.STRING,
        unique:true
    })
    declare storeName: string

    @Column({
        type: DataType.STRING,
        unique: true

    })
    declare storePhoneNumber: string

    @Column({
        type: DataType.STRING
    })
    declare storeAddress: string
    @Column({
        type: DataType.STRING,
        unique: true
    })
    declare storePanNo: string

    @Column({
        type: DataType.STRING,
        unique: true
    })
    declare storeVatNo: string

    @Column({
        type: DataType.STRING,
        unique: true,
        allowNull: false
    })
    declare storeCode : string

    @ForeignKey(() => User)
    @Column({
        type: DataType.UUID,
        allowNull: false
    })
    declare userId: string

    @BelongsTo(() => User)
    declare user: User

}

export default Store