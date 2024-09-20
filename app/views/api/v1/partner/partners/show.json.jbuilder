json.extract! @partner, :name
json.partial! 'api/v1/shared/cover', cover: @partner.logo, name: 'logo'
json.can_edit @can_edit
