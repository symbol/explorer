
1. partial Transactions
2. create wiki for explorer

improve the search box - Mosaic and Namespace

- add End height - namespace, Mosaic
- add Create Time, Expire time
- test:e2e test the defaultNode endpoint
- https://github.com/nemfoundation/nem2-explorer/issues/288  (effection fee issue)
- update the language pack
- https://github.com/nemfoundation/nem2-explorer/issues/267


Small Fix
- add End height - namespace
- Registration type - take off


Completed This week
- added comma format for all thousand in fees and amount
- Node list (/node/peers )
- Create ReceiptComponent


in looking few mins at latest explorer build some possible ui streamlining to consider around namespace list, we provide
- full namespace name/path
- type (root namespace / sub namespace)
- parent ID ( link or n/a)
in case of all 3 its a little redundant.  if parent is empty its a root.., if no <sub><dot><parent>, its a root, and of course if type showing its also a root if stated
at a minimum having "Root Namespace" and "Sub Namespace" for each row in the namespace list is redundant and should be minimized to sub or root
should consider freeing up list view space by not having all 3 designations of root or sub


it('search account by address or public key should redirect to account detail page', () => {

        const address = 'TB65QSXGV5FUTRPVMSCVB4RZ7FJLU32LHOOP4MDI'
        const publicKey = '4428A4DA56362C2293A277159F7C1E270FE7BD6CED461877494006C7D69F1172'

        cy.get('input')
        .type(address)
        .type('{enter}')

        cy.url()
        .should('contain', `account/${address}`)

        cy.get('input')
        .type(publicKey)
        .type('{enter}')

        cy.url()
        .should('contain', `account/${address}`)
    })
  }