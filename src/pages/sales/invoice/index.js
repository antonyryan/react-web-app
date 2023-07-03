import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import cx from 'classnames';
import qs from 'qs';
import { capitalize } from 'lodash'
import { FormattedMessage } from 'react-intl'
import { getInvoice, getAllPayment } from 'redux/sales/actions';

import SnackBar from 'components/snackbar';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';

import Button from 'components/button';

import useGlobalStyles from 'hooks/styles';
import accountLogo from 'resources/sale/larochelle.png'
import paystack from 'resources/sale/paystack.png'
import stampFullyPaid from 'resources/sale/invoice-fully-paid.svg'
import stampOverdue from 'resources/sale/invoice-over-due.svg'
import stampDeposit from 'resources/sale/invoice-deposit-paid.svg'
import vencru from 'resources/logo/vencru-horizontal-mobile.svg'

import { media, useMediaUp } from 'hooks/media';
import useIntl from 'hooks/intl';
import useStyles from './style';


function Invoice(props) {
  const dispatch = useDispatch();
  const [invoiceData, setInvoiceData] = useState();
  const [showSnack, setShowSnack] = useState(true);
  const trans = useIntl();
  const mediaUp = useMediaUp();
  
  const globalClasses = useGlobalStyles();
  const classes = useStyles();

  const { token, invoiceid, businessid } =
    qs.parse(props.location.search, { ignoreQueryPrefix: true });

  useEffect(() => {
    const getInvoiceRequest = new Promise((resolve, reject) => {
      dispatch(getInvoice({
        params: {
          businessid,
          invoiceid,
          userId: token
        },
        onSuccess: data => resolve(data),
        onFail: (status, data) => reject(capitalize(data.Message))
      }));
    });

    const getAllPaymentRequest = new Promise((resolve, reject) => {
      dispatch(getAllPayment({
        params: {
          businessid,
          invoiceid,
          sortby: 'date_created',
          sortorder: 'desc',
          searchquery: '',
          limit: 1000000,
          page: 1,
          fromdate: '',
          todate: '',
          filter: ''
        },
        onSuccess: data => resolve(data),
        onFaile: (status, data) => reject(capitalize(data.Message))
      }));
    });

    Promise.all([getInvoiceRequest, getAllPaymentRequest])
      .then(values => {
        setInvoiceData({ invoice: values[0], payment: values[1] });
        props.onApiSuccess();
      })
      .catch(error => props.onApiFail(error));
  }, []);
  
  if (!invoiceData) {
    return undefined;
  }

  const {invoice} = invoiceData;

  return (
    <>
      <SnackBar
        show={showSnack}
        onClose={() => setShowSnack(false)}
      >
        <FormattedMessage
          id='sales.get_invoice_snack_message'
          values={{
            name: <b>{invoice.client.firstname}</b>,
            account: <b>La Rochelle Bakery</b>
          }}
        />
      </SnackBar>

      <p className={cx(
        classes.title,
        globalClasses.textSubTitle
      )}>
        Invoice {invoice.invoicenumber} for {invoice.client.firstname} {invoice.client.lastname}
      </p>

      <Box className={globalClasses.section}>
        <Grid
          justify='space-between'
          className={classes.overview}
          container
        >
          <Grid item xs className={classes.overviewLeft}>
            <img
              src={accountLogo}
              className={classes.accountLogo}
              alt=''
            />
            <p className={cx(
              globalClasses.textPrimary,
              globalClasses.textLarge
            )}>
              <b>{trans('sales.billed_to')}</b>
            </p>
            <div>
              {invoice.client.firstname} {invoice.client.lastname}
            </div>
            <div className={globalClasses.textPrimary}>
              {invoice.client.companyemail}
            </div>
            <div>
              +{invoice.client.phonenumber}
            </div>
          </Grid>

          <Grid item xs className={classes.overviewStamp}>
            <img src={stampFullyPaid} alt='' />
          </Grid>

          <Grid item xs className={classes.overviewRight}>
            { mediaUp(media.md) && (
              <>
                <div className={cx(
                  globalClasses.textPrimary,
                  classes.overviewSpace
                )}>
                  <b>La Rochelle sweets</b>
                </div>
                <div>No 7 ajah estate, lagos</div>
                {/* <div>{invoice.client.street}, {invoice.client.city}, {invoice.client.country}</div> */}
                <div>
                  {invoice.client.phonenumber}
                </div>
                <div className={classes.overviewSpace}>
                  {invoice.email}
                </div>
              </>
            )}

            <div className={classes.overviewMeta}>
              <div className={globalClasses.textPrimary}>
                <b>{trans('sales.invoice_number')}</b>
              </div>
              <div>{invoice.invoicenumber}</div>
            </div>

            <div className={classes.overviewMeta}>
              <div className={globalClasses.textPrimary}>
                <b>{trans('sales.date_of_issue')}</b>
              </div>
              <div>31/07/2019</div>
            </div>

            <div className={classes.overviewMeta}>
              <div className={globalClasses.textPrimary}>
                <b>{trans('sales.due_date')}</b>
              </div>
              <div>31/08/2019</div>
            </div>
          </Grid>
        </Grid>
        
        <hr className={globalClasses.hbar}/>

        {mediaUp(media.md) ? (
          <table className={classes.invoiceTable}>
            <thead>
              <tr>
                <th className={globalClasses.textPrimary}>
                  {trans('sales.item')}
                  <div className={classes.itemDescription}>
                    {trans('sales.description')}
                  </div>
                </th>
                <th className={globalClasses.textPrimary}>
                  {trans('sales.price')}
                </th>
                <th className={globalClasses.textPrimary}>
                  {trans('sales.qty')}
                </th>
                <th className={cx(
                  globalClasses.textPrimary,
                  classes.alignRight
                )}>
                  {trans('sales.amount')}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  Red Velvet Cake with Strawberry toppings
                  <br/>
                  <i className={classes.itemDescription}>
                    A cake with red toppings sand strawberry toppings dipped in sauce
                  </i>
                </td>
                <td>$500.00</td>
                <td>2</td>
                <td className={classes.alignRight}>$1,000.00</td>
              </tr>
              <tr className={classes.alignRight}>
                <td colSpan={2} rowSpan={7}></td>
                <td>{trans('sales.subtotal')}</td>
                <td>$1,000.00</td>
              </tr>
              <tr className={classes.alignRight}>
                <td>10% {trans('sales.discount')}</td>
                <td>$100.00</td>
              </tr>
              <tr className={classes.alignRight}>
                <td>10% {trans('sales.tax')}</td>
                <td>$70.00</td>
              </tr>
              <tr>
                <td colSpan={2}>
                  <hr className={cx(
                    globalClasses.hbar,
                    classes.hbarThin
                  )}/>
                </td>
              </tr>
              <tr className={cx(
                classes.alignRight,
                globalClasses.textLarge
              )}>
                <td className={globalClasses.textPrimary}>
                  <b>{trans('sales.amount_due')}</b>
                </td>
                <td>$970.00</td>
              </tr>
              <tr className={classes.alignRight}>
                <td>30% {trans('sales.deposit')}</td>
                <td>$300.00</td>
              </tr>
              <tr className={cx(
                classes.alignRight,
                globalClasses.textLarge
              )}>
                <td className={globalClasses.textGreen}>
                  <b>{trans('sales.amount_paid')} (USD)</b>
                </td>
                <td>$100.00</td>
              </tr>
            </tbody>
          </table>
        ) : (
          <table className={classes.invoiceTable}>
            <thead>
              <tr>
                <th className={globalClasses.textPrimary}>
                  {trans('sales.description')}
                </th>
                <th className={cx(
                  globalClasses.textPrimary,
                  classes.alignRight
                )}>
                  {trans('sales.total_amount')}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  Red Velvet Cake with Strawberry toppings
                  <br/>
                  <span className={classes.itemDescription}>
                    <FormattedMessage
                      id='sales.qty_price_unit'
                      values={{ qty: 2, price: '$500.00' }}
                    />
                  </span>
                </td>
                <td className={classes.alignRight}>$1000.00</td>
              </tr>
              <tr className={classes.alignRight}>
                <td>{trans('sales.subtotal')}</td>
                <td>$1,000.00</td>
              </tr>
              <tr className={classes.alignRight}>
                <td>10% {trans('sales.discount')}</td>
                <td>$100.00</td>
              </tr>
              <tr className={classes.alignRight}>
                <td>10% {trans('sales.tax')}</td>
                <td>$70.00</td>
              </tr>
              <tr>
                <td colSpan={2}>
                  <hr align='right' className={cx(
                    globalClasses.hbar,
                    classes.tableSplit
                  )}/>
                </td>
              </tr>
              <tr className={cx(
                classes.alignRight,
                globalClasses.textLarge
              )}>
                <td className={globalClasses.textPrimary}>
                  <b>{trans('sales.amount_due')}</b>
                </td>
                <td>$970.00</td>
              </tr>
              <tr className={classes.alignRight}>
                <td>30% {trans('sales.deposit')}</td>
                <td>$300.00</td>
              </tr>
              <tr className={cx(
                classes.alignRight,
                globalClasses.textLarge
              )}>
                <td className={globalClasses.textGreen}>
                  <b>{trans('sales.amount_paid')} (USD)</b>
                </td>
                <td>$100.00</td>
              </tr>
            </tbody>
          </table>
        )}

        <Grid container className={classes.topSpacing}>
          <Grid
            item xs={12} sm={6}
            className={classes.leftAlign}
          >
            <p className={cx(
              globalClasses.textPrimary,
              globalClasses.textLarge,
            )}>
              {trans('sales.payment_instructions')}
            </p>
            <div>
              {trans('sales.direct_bank_transfer')}
            </div>
            <div className={globalClasses.textPrimary}>
              {trans('sales.bank_name')}: Gtbank - Savings
            </div>
            <div className={globalClasses.textPrimary}>
              {trans('sales.account_number')}: 0012346578
            </div>
            <div className={globalClasses.textPrimary}>
              {trans('sales.account_name')}: Lanray Okemati
            </div>
          </Grid>
          {/* <Grid
            item xs={12} sm={6}
            className={cx({[classes.topSpacing]: !mediaUp(media.sm)})}
          >
            <p className={cx({[classes.leftAlign]: !mediaUp(media.sm)})}>
              {trans('sales.online_bank_or_card_payment')}
            </p>
            <div className={classes.paynow}>
              <Button thin green fullWidth>
                {trans('sales.pay_now')}
              </Button>
            </div>

            <div className={classes.paystack}>
              <small>{trans('sales.secured_by')}</small>
              <img src={paystack} alt='' />
            </div>
          </Grid>*/}
        </Grid>

        <Box className={classes.leftAlign}>
          <p className={cx(
            globalClasses.textPrimary,
            globalClasses.textLarge,
          )}>
            {trans('sales.notes_and_terms')}
          </p>
          <div>
            {trans('sales.thank_you_for_your_order')}
          </div>
        </Box>

        <hr className={globalClasses.hbar}/>

        <Box className={classes.footer}>
          <span>{trans('sales.powered_by')}</span>
          <img src={vencru} alt='' />
        </Box>
      </Box>
    </>
  )
}

export default React.memo(Invoice);
