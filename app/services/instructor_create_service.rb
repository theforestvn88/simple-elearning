class InstructorCreateService
    Result = Struct.new(:success, :instructor, :random_password)

    def create(email:, name:, partner_id:, rank: nil, send_email: true)
        random_password = SecureRandom.hex(10)
        instructor = Instructor.new(
            email: email, 
            name: name, 
            password: random_password, 
            password_confirmation: random_password, 
            partner_id: partner_id, 
            rank: rank || Instructor.default_rank
        )
        
        if instructor.save
            if send_email
                ::InstructorMailer.with(instructor: instructor, random_password: random_password).inform_new_account.deliver_later
            end
            
            return Result.new(true, instructor, random_password)
        else
            return Result.new(false, instructor, nil)
        end
    end
end
