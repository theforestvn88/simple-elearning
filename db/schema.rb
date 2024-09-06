# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[7.1].define(version: 2024_08_22_080112) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  # Custom types defined in this database.
  # Note that some types may not work with other database engines. Be careful if changing database.
  create_enum "academic_rank", ["Lecturer", "Assistant Professor", "Associate Professor", "Professor", "President"]

  create_table "action_text_rich_texts", force: :cascade do |t|
    t.string "name", null: false
    t.text "body"
    t.string "record_type", null: false
    t.bigint "record_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["record_type", "record_id", "name"], name: "index_action_text_rich_texts_uniqueness", unique: true
  end

  create_table "active_storage_attachments", force: :cascade do |t|
    t.string "name", null: false
    t.string "record_type", null: false
    t.bigint "record_id", null: false
    t.bigint "blob_id", null: false
    t.datetime "created_at", null: false
    t.index ["blob_id"], name: "index_active_storage_attachments_on_blob_id"
    t.index ["record_type", "record_id", "name", "blob_id"], name: "index_active_storage_attachments_uniqueness", unique: true
  end

  create_table "active_storage_blobs", force: :cascade do |t|
    t.string "key", null: false
    t.string "filename", null: false
    t.string "content_type"
    t.text "metadata"
    t.string "service_name", null: false
    t.bigint "byte_size", null: false
    t.string "checksum"
    t.datetime "created_at", null: false
    t.index ["key"], name: "index_active_storage_blobs_on_key", unique: true
  end

  create_table "active_storage_variant_records", force: :cascade do |t|
    t.bigint "blob_id", null: false
    t.string "variation_digest", null: false
    t.index ["blob_id", "variation_digest"], name: "index_active_storage_variant_records_uniqueness", unique: true
  end

  create_table "activities", force: :cascade do |t|
    t.string "trackable_type"
    t.bigint "trackable_id"
    t.string "actor_type"
    t.bigint "actor_id"
    t.string "action"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["actor_id", "actor_type"], name: "index_activities_on_actor_id_and_actor_type"
    t.index ["actor_type", "actor_id"], name: "index_activities_on_actor"
    t.index ["trackable_id", "trackable_type"], name: "index_activities_on_trackable_id_and_trackable_type"
    t.index ["trackable_type", "trackable_id"], name: "index_activities_on_trackable"
  end

  create_table "assignments", force: :cascade do |t|
    t.string "assignable_type"
    t.bigint "assignable_id"
    t.string "assignee_type"
    t.bigint "assignee_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["assignable_id", "assignable_type"], name: "index_assignments_on_assignable_id_and_assignable_type"
    t.index ["assignable_type", "assignable_id"], name: "index_assignments_on_assignable"
    t.index ["assignee_id", "assignee_type"], name: "index_assignments_on_assignee_id_and_assignee_type"
    t.index ["assignee_type", "assignee_id"], name: "index_assignments_on_assignee"
  end

  create_table "courses", force: :cascade do |t|
    t.string "name"
    t.string "summary"
    t.text "description"
    t.integer "estimated_minutes", default: 0, null: false
    t.integer "lessons_count", default: 0, null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.bigint "instructor_id", null: false
    t.bigint "partner_id", null: false
    t.index ["instructor_id"], name: "index_courses_on_instructor_id"
    t.index ["partner_id"], name: "index_courses_on_partner_id"
  end

  create_table "instructors", force: :cascade do |t|
    t.string "email", null: false
    t.string "password_digest", null: false
    t.string "name"
    t.text "introduction"
    t.json "info"
    t.enum "rank", default: "Lecturer", null: false, enum_type: "academic_rank"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.bigint "partner_id", null: false
    t.index ["email"], name: "index_instructors_on_email", unique: true
    t.index ["partner_id"], name: "index_instructors_on_partner_id"
  end

  create_table "lessons", force: :cascade do |t|
    t.string "name"
    t.integer "estimated_minutes", default: 0, null: false
    t.integer "position", default: 0, null: false
    t.bigint "milestone_id", null: false
    t.bigint "course_id", null: false
    t.bigint "instructor_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["course_id"], name: "index_lessons_on_course_id"
    t.index ["instructor_id"], name: "index_lessons_on_instructor_id"
    t.index ["milestone_id"], name: "index_lessons_on_milestone_id"
  end

  create_table "milestones", force: :cascade do |t|
    t.string "name"
    t.integer "estimated_minutes", default: 0, null: false
    t.integer "position", default: 0, null: false
    t.integer "lessons_count", default: 0, null: false
    t.bigint "course_id", null: false
    t.bigint "instructor_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["course_id"], name: "index_milestones_on_course_id"
    t.index ["instructor_id"], name: "index_milestones_on_instructor_id"
  end

  create_table "partners", force: :cascade do |t|
    t.string "name", null: false
    t.string "email", null: false
    t.string "slug", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["email"], name: "index_partners_on_email", unique: true
    t.index ["slug"], name: "index_partners_on_slug", unique: true
  end

  create_table "users", force: :cascade do |t|
    t.string "email", null: false
    t.string "password_digest", null: false
    t.string "name", null: false
    t.string "title"
    t.string "location"
    t.text "introduction"
    t.json "social_links"
    t.boolean "verified", default: false, null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["email"], name: "index_users_on_email", unique: true
  end

  add_foreign_key "active_storage_attachments", "active_storage_blobs", column: "blob_id"
  add_foreign_key "active_storage_variant_records", "active_storage_blobs", column: "blob_id"
  add_foreign_key "courses", "instructors"
  add_foreign_key "courses", "partners"
  add_foreign_key "instructors", "partners"
  add_foreign_key "lessons", "courses"
  add_foreign_key "lessons", "instructors"
  add_foreign_key "lessons", "milestones"
  add_foreign_key "milestones", "courses"
  add_foreign_key "milestones", "instructors"
end
