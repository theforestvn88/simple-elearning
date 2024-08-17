class CreateLessons < ActiveRecord::Migration[7.1]
  def change
    create_table :lessons do |t|
      t.string :name
      t.integer :estimated_minutes, null: false, default: 0
      t.references :milestone, null: false, foreign_key: true
      t.references :course, null: false, foreign_key: true
      t.references :instructor, null: false, foreign_key: true

      t.timestamps
    end
  end
end
