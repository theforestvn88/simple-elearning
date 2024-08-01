FactoryBot.define do
  factory :partner do
    name { Faker::Company.name }
    email { Faker::Internet.email }
    slug { Faker::Internet.slug }
  end
end
