class CreateInstructors < ActiveRecord::Migration[7.1]
  def up
    create_enum :academic_rank, ["Lecturer", "Assistant Professor", "Associate Professor", "Professor", "President"]

    create_table :instructors do |t|
      t.string :email, null: false, index: { unique: true }
      t.string :password_digest, null: false
      t.string :name
      t.text :introduction
      t.json :info
      t.enum :rank, enum_type: "academic_rank", default: "Lecturer", null: false

      t.timestamps
    end
  end

  def down
    drop_table :instructors

    execute <<-SQL
      DROP TYPE academic_rank;
    SQL
  end
end
