class PartnerMailer < ApplicationMailer
    def inform_new_partner
        @partner = params[:partner]
        @admin_random_password = params[:admin_random_password]

        mail to: @partner.email, subject: 'Inform New Partner'
    end
end
