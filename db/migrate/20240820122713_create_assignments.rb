class CreateAssignments < ActiveRecord::Migration[7.1]
  def change
    create_table :assignments do |t|
      t.references :assignable, polymorphic: true
      t.references :assignee, polymorphic: true

      t.timestamps
    end

    add_index :assignments, %i[assignable_id assignable_type]
    add_index :assignments, %i[assignee_id assignee_type]
  end
end
