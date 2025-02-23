import { craftPostRequest } from './helpers'

const API = process.env.VUE_APP_FEAI_SERVER

export async function connect (taskID, clientID) {
  return await fetch(API.concat(`connect/${taskID}/${clientID}`))
}

export async function disconnect (taskID, clientID) {
  return await fetch(API.concat(`disconnect/${taskID}/${clientID}`))
}

export async function selectionStatus (taskID, clientID) {
  return await fetch(API.concat(`selection/${taskID}/${clientID}`))
}

export async function aggregationStatus (taskID, round, clientID) {
  return await fetch(API.concat(`aggregation/${taskID}/${round}/${clientID}`))
}

export async function queryLogs (taskID, round, clientID) {
  const params = []
  if (taskID !== undefined) params.push(`task=${taskID}`)
  if (round !== undefined) params.push(`round=${round}`)
  if (clientID !== undefined) params.push(`id=${clientID}`)
  const query = params.join('&')
  return await fetch(API.concat(`logs?${query}`))
}

export async function postWeights (taskID, round, clientID, weights) {
  const request = craftPostRequest('weights', weights)
  return await fetch(
    API.concat(`weights/${taskID}/${round}/${clientID}`),
    request
  )
}

export async function postMetadata (
  taskID,
  round,
  clientID,
  metadataID,
  metadata
) {
  const request = craftPostRequest(metadataID, metadata)
  return await fetch(
    API.concat(`metadata/${metadataID}/${taskID}/${round}/${clientID}`),
    request
  )
}

export async function getMetadataMap (taskID, round, clientID, metadataID) {
  return await fetch(
    API.concat(`metadata/${metadataID}/${taskID}/${round}/${clientID}`)
  )
}
