class CreatePartners < ActiveRecord::Migration[7.1]
  def change
    create_table :partners do |t|
      t.string :name, null: false
      t.string :email, null: false, index: { unique: true }
      t.string :slug, null: false, index: { unique: true }

      t.timestamps
    end
  end
end
