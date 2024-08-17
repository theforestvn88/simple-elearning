FactoryBot.define do
  factory :lesson do
    name { "MyString" }
    association :milestone
    association :course
    association :instructor
  end
end
