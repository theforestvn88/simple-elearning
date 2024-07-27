# Preview all emails at http://localhost:3000/rails/mailers/partner_mailer
class PartnerMailerPreview < ActionMailer::Preview
    def inform_new_partner
        partner = Partner.first
        ::PartnerMailer.with(partner: partner, admin_random_password: 'xxxxxxx').inform_new_partner
    end
end
