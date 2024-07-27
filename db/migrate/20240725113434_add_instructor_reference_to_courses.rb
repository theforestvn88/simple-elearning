class AddInstructorReferenceToCourses < ActiveRecord::Migration[7.1]
  def change
    add_reference :courses, :instructor, index: { unique: true }, foreign_key: true
  end
end
