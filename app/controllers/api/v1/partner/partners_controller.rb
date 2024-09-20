# frozen_string_literal: true

module Api
    module V1
        module Partner
            class PartnersController < ::PartnerApiController
                before_action :authenticate!, only: [:update]
                before_action :try_authenticate, only: [:show]
                before_action :find_partner

                def show
                    @can_edit = policy.update?
                end

                def update
                    authorize @partner

                    if @partner.update(partner_params)
                        @can_edit = true
                        render :show, status: :ok
                    else
                        render json: @partner.errors, status: :unprocessable_entity
                    end
                end

                private

                    def partner_params
                        params.require(:partner).permit(:logo, :name)
                    end

                    def find_partner
                        @partner = ::Partner.find_by(slug: params[:identify])
                        raise ActiveRecord::RecordNotFound if @partner.nil?
                    end

                    def policy
                        @partner_policy ||= Pundit.policy(current_user, @partner)
                    end
            end
        end
    end
end
