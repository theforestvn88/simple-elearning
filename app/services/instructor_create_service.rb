class InstructorCreateService
    Result = Struct.new(:success, :instructor, :random_password)

    def call(email:, name:)
        random_password = SecureRandom.hex(10)
        instructor = Instructor.new(email: email, name: name, password: random_password, password_confirmation: random_password)
        if instructor.save
            ::InstructorMailer.with(instructor: instructor, random_password: random_password).inform_new_account.deliver_later
            return Result.new(true, instructor, random_password)
        else
            return Result.new(false, instructor, nil)
        end
    end
end
