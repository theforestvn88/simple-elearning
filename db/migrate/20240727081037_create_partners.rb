class CreatePartners < ActiveRecord::Migration[7.1]
  def change
    create_table :partners do |t|
      t.string :name, null: false
      t.string :email, null: false

      t.timestamps

      t.index [:name, :email], name: :index_partner_name_email_uniqueness, unique: true
    end
  end
end
