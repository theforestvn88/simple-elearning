class CreateMilestones < ActiveRecord::Migration[7.1]
  def change
    create_table :milestones do |t|
      t.string :name
      t.integer :estimated_minutes, null: false, default: 0
      t.integer :position, null: false, default: 0
      t.integer :lessons_count, null: false, default: 0
      t.references :course, null: false, foreign_key: true
      t.references :instructor, null: false, foreign_key: true

      t.timestamps
    end
  end
end
