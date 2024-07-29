module Admin
  class PartnersController < Admin::ApplicationController
    def create
      partner_params = params.require(:partner).permit(:email, :name, :slug)
      result = ::PartnerCreateService.new.create(partner_params)

      respond_to do |format|
        if result.success
          format.html { redirect_to admin_partner_url(result.partner) }
        else
          format.html { render :new, status: :unprocessable_entity, locals: { page: Administrate::Page::Form.new(dashboard, result.partner) } }
        end
      end
    end
  end
end
