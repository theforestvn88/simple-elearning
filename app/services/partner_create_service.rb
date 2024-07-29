class PartnerCreateService
    Result = Struct.new(:success, :partner, :admin_random_password)

    def call(partner_params)
        partner = Partner.new(partner_params)
        
        if partner.save
            create_admin_result = ::InstructorCreateService.new.call(
                email: partner_params[:email],
                name: partner_params[:name],
                partner_id: partner.id,
                rank: Instructor.admin_rank,
                send_email: false
            )

            if create_admin_result.success
                ::PartnerMailer.with(partner: partner, admin_random_password: create_admin_result.random_password)
                    .inform_new_partner
                    .deliver_later

                return Result.new(true, partner, create_admin_result.random_password)
            else
                return create_admin_result
            end
        else
            return Result.new(false, partner, nil)
        end
    end
end
