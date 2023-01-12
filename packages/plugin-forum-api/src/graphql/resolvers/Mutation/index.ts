import { IContext } from '../..';
import { IObjectTypeResolver } from '@graphql-tools/utils';
import categoryMutations from './categoryMutations';
import postMutations from './postMutations';
import commentMutations from './commentMutations';
import voteMutations from './voteMutatations';
import followMutations from './followMutations';
import permissionGroupMutations from './permissionGroup';
import subscriptionProductMutations from './subscriptionProductMutations';
import subscriptionOrderMutations from './subscriptionOrderMutations';
import pageMutations from './pageMutations';
import pollMutations from './pollMutations';

const Mutation: IObjectTypeResolver<any, IContext> = {
  ...categoryMutations,
  ...postMutations,
  ...commentMutations,
  ...voteMutations,
  ...followMutations,
  ...permissionGroupMutations,
  ...subscriptionProductMutations,
  ...subscriptionOrderMutations,
  ...pageMutations,
  ...pollMutations
};

export default Mutation;
