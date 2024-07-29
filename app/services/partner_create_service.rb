class PartnerCreateService
    Result = Struct.new(:success, :partner, :admin_random_password)

    def create(partner_params)
        result = nil
        partner = Partner.new(partner_params)

        ActiveRecord::Base.transaction do
            if partner.save
                create_admin_result = ::InstructorCreateService.new.create(
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

                    result = Result.new(true, partner, create_admin_result.random_password)
                else
                    partner.errors.add(:admin, create_admin_result.instructor.errors.full_messages.first)
                    raise ActiveRecord::Rollback
                end
            else
                result = Result.new(false, partner, nil)
                raise ActiveRecord::Rollback
            end
        ensure
            result ||= Result.new(false, partner, nil)
        end

        result
    end
end
