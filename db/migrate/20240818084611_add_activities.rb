class AddActivities < ActiveRecord::Migration[7.1]
  def change
    create_table :activities do |t|
      t.references :trackable, polymorphic: true
      t.references :actor, polymorphic: true
      t.string :action

      t.timestamps
    end

    add_index :activities, %i[trackable_id trackable_type]
    add_index :activities, %i[actor_id actor_type]
  end
end
