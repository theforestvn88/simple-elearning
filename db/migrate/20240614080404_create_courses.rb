class CreateCourses < ActiveRecord::Migration[7.1]
  def change
    create_table :courses do |t|
      t.string    :name
      t.string    :summary
      t.text      :description
      t.integer   :estimated_minutes, null: false, default: 0
      t.integer   :lessons_count, null: false, default: 0

      t.timestamps
    end
  end
end
