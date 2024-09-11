class CreateAssignments < ActiveRecord::Migration[7.1]
  def change
    create_table :assignments do |t|
      t.references :assignable, polymorphic: true
      t.references :assignee, polymorphic: true

      t.timestamps
      
      t.index %i[assignable_id assignable_type assignee_id assignee_type], name: :assignments_uniqueness, unique: true
    end

  end
end
