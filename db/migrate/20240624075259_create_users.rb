class CreateUsers < ActiveRecord::Migration[7.1]
  def change
    create_table :users do |t|
      t.string :email, null: false, index: { unique: true }
      t.string :password_digest, null: false
      t.string :name, null: false
      t.string :title
      t.string :location
      t.text   :introduction
      t.json   :social_links
      t.boolean :verified, null: false, default: false

      t.timestamps
    end
  end
end
