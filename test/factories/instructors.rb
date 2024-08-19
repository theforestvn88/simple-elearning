FactoryBot.define do
  factory :instructor do
    sequence(:email) { |n| "instructor#{n}@example.com" }
    password { "0123456789" }
    password_confirmation { "0123456789" }
    name { Faker::Internet.username }
    introduction { "MyText" }
    info { "" }
    rank { "Lecturer" }
    association :partner
  end

  factory :instructor_with_avatar, class: Instructor do
    sequence(:email) { |n| "instructor#{n}-with-avatar@example.com" }
    password { "0123456789" }
    password_confirmation { "0123456789" }
    name { Faker::Internet.username }
    introduction { "MyText" }
    info { "" }
    rank { "Lecturer" }
    association :partner

    after(:build) do |instructor|
      instructor.avatar.attach(
        io: File.open(Rails.root.join('test', 'fixtures', 'files', 'images', 'test_img.png')),
        filename: 'test_img.png',
        content_type: 'image/png'
      )
    end
  end
end
